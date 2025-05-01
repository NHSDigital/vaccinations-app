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
    additional_environment_variables = var.application_environment_variables

    cloudwatch_log = {
      skip_destroy      = true
      retention_in_days = var.log_retention_in_days
    }
    logging_config = {
      log_format = "JSON"
    }

    runtime               = var.nodejs_version
    function_architecture = "arm64"
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
