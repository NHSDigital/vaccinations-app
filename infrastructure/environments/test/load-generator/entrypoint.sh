#!/bin/bash
set -e

# Define variables
RESULTS_PATH=$(date +%Y)/$(date +%m)/$(date +%d)
RESULT_FILE=$(date +%H_%M_%S_%3N)_$RANDOM.jtl

# Download the JMeter test plan from S3
echo "Downloading test plan from S3..."
aws s3 cp "s3://${S3_BUCKET}/plans/${TEST_PLAN}" /opt/jmeter/test_plan.jmx
echo "Downloaded."

# Run JMeter test
echo "Running JMeter test..."
jmeter -n \
  -t /opt/jmeter/test_plan.jmx \
  -JThreads="${THREADS}" \
  -JRampUp="${RAMPUP}" \
  -JDuration="${DURATION}" \
  -JEnvironment="${ENVIRONMENT}" \
  -JBaseLocation="/opt/jmeter" \
  -l "/opt/jmeter/${RESULT_FILE}"
echo "Done."

# Upload the results back to S3
echo "Uploading results to S3..."
aws s3 cp "/opt/jmeter/${RESULT_FILE}" "s3://${S3_BUCKET}/results/${RESULTS_PATH}/"
echo "Uploaded."

echo "Load test completed successfully."
