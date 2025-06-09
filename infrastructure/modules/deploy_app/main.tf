module "deploy_app" {
  source            = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version           = "3.6.0"
  open_next_version = "v3.x.x"
  function_architecture = "arm64"
  prefix      = var.prefix
  folder_path = var.open-next-path

  providers = {
    aws.server_function = aws.server_function
    aws.iam             = aws.iam
    aws.dns             = aws.dns
    aws.global          = aws.global
  }

  domain_config = {
    create_route53_entries         = false
    route53_record_allow_overwrite = false

    sub_domain = coalesce(var.sub_domain, null)
    hosted_zones = [
      { name = var.domain }
    ]

    viewer_certificate = {
      acm_certificate_arn = var.acm_certificate_arn
    }
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
}
