locals {
  project = "load-generator"

  environment = {
    DURATION    = 3600                    # duration of the test in seconds
    RAMPUP      = 600                     # seconds to ramp up concurrent threads linearly, 1 -> $THREADS
    THREADS     = 400                     # the number of concurrent threads to use
    ENVIRONMENT = "test"                  # the subdomain that represents the environment to run the test on
    S3_BUCKET   = var.s3_bucket_name      # the bucket name to use for test inputs and outputs
    TEST_PLAN   = "vita-user-journey.jmx" # the *.jmx file name to use as the jmeter test plan
  }
}
