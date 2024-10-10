#!/bin/sh

TIMEOUT=15
QUIET=0
WAIT_INTERVAL=1
HOST=
PORT=

echoerr() {
    if [ "$QUIET" -ne 1 ]; then
        echo "$@" 1>&2;
    fi
}

usage() {
    cat << USAGE >&2
Usage:
    wait-for-it.sh host:port [-s] [-t timeout] [-- command args]
    -h | --help       Display this help message
    -q | --quiet      Do not output any status messages
    -t TIMEOUT        Timeout in seconds, zero for no timeout
    -- COMMAND ARGS   Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for() {
    for i in `seq $TIMEOUT` ; do
        nc -z "$HOST" "$PORT" > /dev/null 2>&1
        result=$?
        if [ $result -eq 0 ] ; then
            if [ "$QUIET" -ne 1 ]; then
                echo "wait-for-it.sh: $HOST:$PORT is available after $i second(s)."
            fi
            return 0
        fi
        sleep "$WAIT_INTERVAL"
    done
    echo "wait-for-it.sh: timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT."
    return 1
}

wait_for_wrapper() {
    if [ "$TIMEOUT" -gt 0 ]; then
        timeout $TIMEOUT sh -c "wait_for"
    else
        wait_for
    fi
}

# Parse arguments
while [ $# -gt 0 ]
do
    case "$1" in
        *:* )
        HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
        PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [ "$TIMEOUT" = "" ]; then break; fi
        shift 2
        ;;
        --)
        shift
        break
        ;;
        -h | --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
    echoerr "Error: you need to provide a host and port to test."
    usage
fi

# Wait for MySQL and then delay by 40 seconds
wait_for_wrapper

echo "Waiting for 40 seconds to ensure MySQL is fully initialized..."
sleep 40  # Introducing a 40-second delay

shift $((OPTIND-1))

if [ "$#" -gt 0 ]; then
    exec "$@"
else
    exit 0
fi
