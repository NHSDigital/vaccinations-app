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
  }

  website_bucket = {
    force_destroy = true
  }

  prefix      = var.prefix
  folder_path = var.open-next-path
}
