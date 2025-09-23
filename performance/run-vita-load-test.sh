#!/bin/bash

# Default values
THREADS=1
RAMPUP=1
DURATION=60
ENVIRONMENT="test"
JMETER_PATH="./jmeter"
TEST_PLAN="vita-user-journey" 

# Help message for options
show_help() {
  echo "Usage: $0 [-t THREADS] [-r RAMPUP] [-d DURATION] [-e ENVIRONMENT] [-p TEST_PLAN]"
  echo ""
  echo "Options:"
  echo "  -t, --threads       Number of threads (users) [default: 10]"
  echo "  -r, --rampup        Ramp-up period in seconds [default: 5]"
  echo "  -d, --duration      Duration of the test in seconds [default: 60]"
  echo "  -e, --environment   Target environment (e.g., dev, test, staging, prod) [default: test]"
  echo "  -h, --help          Show this help message"
  echo "  -p, --test-plan     Sets the jmx file name, don't add the .jmx file extension"
}

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -t|--threads) THREADS="$2"; shift ;;
    -r|--rampup) RAMPUP="$2"; shift ;;
    -d|--duration) DURATION="$2"; shift ;;
    -e|--environment) ENVIRONMENT="$2"; shift ;;
    -p|--test-plan) TEST_PLAN="$2"; shift ;;
    -h|--help) show_help; exit 0 ;;
    *) echo "Unknown parameter passed: $1"; show_help; exit 1 ;;
  esac
  shift
done

# Generate data
TIMESTAMP=$(date +"%Y%m%d_%H%M")
CURRENT_DIR=$(pwd)

# Run JMeter test
echo "Running JMeter test with:"
echo "  Test Plan: $TEST_PLAN"
echo "  Threads: $THREADS"
echo "  Ramp-up: $RAMPUP seconds"
echo "  Duration: $DURATION seconds"
echo "  Environment: $ENVIRONMENT"
echo "  Timestamp: $TIMESTAMP"
echo " " 
echo " "

#Generate log file name
LOG_FILE="${TEST_PLAN}_${THREADS}Users_${TIMESTAMP}.jtl" 

$JMETER_PATH -n \
  -t "$TEST_PLAN.jmx" \
  -JThreads="$THREADS" \
  -JRampUp="$RAMPUP" \
  -JDuration="$DURATION" \
  -JEnvironment="$ENVIRONMENT" \
  -JBaseLocation="$CURRENT_DIR" \
  -l "$LOG_FILE"

echo "Test completed. Results saved to ./$LOG_FILE"
