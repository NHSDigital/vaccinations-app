module "content_cache_hydrator_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${var.prefix}-content-cache-hydrator"
  lambda_role   = aws_iam_role.lambda_role.arn
  description   = "Content cache hydrator lambda"
  handler       = "lambda.handler"
  runtime       = var.nodejs_version

  create_package         = false
  local_existing_package = "${path.module}/../../../lambda.zip"

  tags = var.default_tags
}
