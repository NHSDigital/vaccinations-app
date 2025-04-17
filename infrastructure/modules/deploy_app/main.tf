module "deploy_app" {
  source            = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version           = ">= 3.4.0,< 3.5.0"
  open_next_version = "v3.5.3"

  providers = {
    aws.server_function = aws.server_function
    aws.iam             = aws.iam
    aws.dns             = aws.dns
    aws.global          = aws.global
  }

  server_function = {
    additional_iam_policies = [aws_iam_policy.server_lambda_additional_policy]
    additional_environment_variables = {
      SSM_PREFIX          = var.ssm_prefix
      CONTENT_CACHE_PATH  = var.content_cache_path
      PINO_LOG_LEVEL      = var.pino_log_level
    }
    cloudwatch_log = {
      skip_destroy      = true
      retention_in_days = var.log_retention_in_days
    }
    runtime = var.nodejs_version
  }

  warmer_function = {
    enabled = true
    additional_iam_policies = [aws_iam_policy.cache_lambda_additional_policy]
    runtime = var.nodejs_version
    concurrency = 1
    schedule = "rate(7 days)"
    additional_environment_variables = {
      SSM_PREFIX          = var.ssm_prefix
      CONTENT_CACHE_PATH  = var.content_cache_path
      PINO_LOG_LEVEL      = var.pino_log_level
    }
    cloudwatch_log = {
      skip_destroy      = true
      retention_in_days = var.log_retention_in_days
    }
    function_code = {
      handler = "lambda.handler"
      zip = {
        path = var.cache_lambda_zip_path
        hash = filemd5(var.cache_lambda_zip_path)
      }
    }
  }

  image_optimisation_function = {
    runtime = var.nodejs_version
  }

  revalidation_function = {
    runtime = var.nodejs_version
  }

  website_bucket = {
    force_destroy = true
  }

  prefix      = var.prefix
  folder_path = var.open-next-path
}
