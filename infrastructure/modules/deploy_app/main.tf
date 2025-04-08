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
    runtime = "nodejs22.x"
  }

  image_optimisation_function = {
    runtime = "nodejs22.x"
  }

  revalidation_function = {
    runtime = "nodejs22.x"
  }

  website_bucket = {
    force_destroy = true
  }

  prefix      = var.prefix
  folder_path = var.open-next-path
}
