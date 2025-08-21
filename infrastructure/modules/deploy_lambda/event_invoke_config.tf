resource "aws_lambda_function_event_invoke_config" "cache_hydrator_lambda_event_invoke_config" {
  function_name                = "${var.prefix}-content-cache-hydrator"
  maximum_event_age_in_seconds = 1800
  maximum_retry_attempts       = 2
}
