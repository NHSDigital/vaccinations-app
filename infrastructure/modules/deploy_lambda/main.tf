module "content_cache_hydrator_lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 7.21.1"

  function_name         = "${var.prefix}-content-cache-hydrator"
  description           = "Content cache hydrator lambda"
  handler               = "lambda.handler"
  environment_variables = var.application_environment_variables
  layers                = ["arn:aws:lambda:eu-west-2:133256977650:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:20"]

  architectures                  = ["arm64"]
  runtime                        = var.nodejs_version
  reserved_concurrent_executions = 1
  timeout                        = 60
  memory_size                    = 256
  publish                        = true

  create_role = false
  lambda_role = aws_iam_role.cache_lambda_iam_role.arn

  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  cloudwatch_logs_skip_destroy      = true
  logging_log_format                = "JSON"

  create_package         = false
  local_existing_package = var.cache_lambda_zip_path

  allowed_triggers = {
    OnDeploymentRule = {
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.cache_hydrator_lambda_deployment_event_rule.arn
    }

    OnScheduleRule = {
      principal  = "events.amazonaws.com"
      source_arn = aws_cloudwatch_event_rule.cache_hydrator_lambda_schedule_event_rule.arn
    }
  }

  tags = var.default_tags
}
