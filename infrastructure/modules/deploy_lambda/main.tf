module "content_cache_hydrator_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name         = "${var.prefix}-content-cache-hydrator"
  description           = "Content cache hydrator lambda"
  handler               = "lambda.handler"
  environment_variables = var.application_environment_variables

  architectures = ["arm64"]
  runtime                        = var.nodejs_version
  reserved_concurrent_executions = 1

  create_role = false
  lambda_role = aws_iam_role.cache_lambda_iam_role.arn

  cloudwatch_logs_retention_in_days = var.log_retention_in_days
  cloudwatch_logs_skip_destroy      = true
  logging_log_format                = "JSON"

  create_package         = false
  local_existing_package = var.cache_lambda_zip_path

  tags = var.default_tags
}
