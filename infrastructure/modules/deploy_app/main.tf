module "deploy_app" {
  source                = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version               = "3.6.1"
  open_next_version     = "v3.x.x"
  function_architecture = "arm64"
  prefix                = var.prefix
  folder_path           = var.open-next-path

  providers = {
    aws.server_function = aws.server_function
    aws.iam             = aws.iam
    aws.dns             = aws.dns
    aws.global          = aws.global
  }

  domain_config = {
    create_route53_entries         = false
    route53_record_allow_overwrite = false

    sub_domain = var.sub_domain
    hosted_zones = [
      { name = var.domain }
    ]

    viewer_certificate = {
      acm_certificate_arn = var.acm_certificate_arn
    }
  }

  waf = {
    deployment = "CREATE",
    aws_managed_rules = [
      {
        name                  = "amazon-ip-reputation-list"
        aws_managed_rule_name = "AWSManagedRulesAmazonIpReputationList"
      },
      {
        name                  = "common-rule-set"
        aws_managed_rule_name = "AWSManagedRulesCommonRuleSet"
      },
      {
        name                  = "known-bad-inputs"
        aws_managed_rule_name = "AWSManagedRulesKnownBadInputsRuleSet"
      }
    ]
  }

  server_function = {
    additional_iam_policies          = [aws_iam_policy.server_lambda_additional_policy]
    additional_environment_variables = var.application_environment_variables
    layers                           = ["arn:aws:lambda:eu-west-2:133256977650:layer:AWS-Parameters-and-Secrets-Lambda-Extension-Arm64:20"]
    enable_streaming                 = true
    timeout                          = 30
    memory_size                      = 2048

    cloudwatch_log = {
      skip_destroy      = true
      retention_in_days = var.log_retention_in_days
    }
    logging_config = {
      log_format            = "JSON"
      application_log_level = "INFO"
      system_log_level      = "INFO"
    }

    runtime = var.nodejs_version
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
