#!/bin/bash
set -ex

# Define variables
RESULT_FILE=result-$(date +%Y%m%d%H%M%S).jtl

# Download the JMeter test plan from S3
echo "Downloading test plan from S3..."
aws s3 cp "s3://${S3_BUCKET}/plans/${TEST_PLAN}" /opt/jmeter/test_plan.jmx

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

# Upload the results back to S3
echo "Uploading results to S3..."
aws s3 cp "/opt/jmeter/${RESULT_FILE}" "s3://${S3_BUCKET}/results/"

echo "Test execution completed."
