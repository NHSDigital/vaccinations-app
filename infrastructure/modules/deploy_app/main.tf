data "aws_caller_identity" "current" {}

module "deploy_app" {
  source  = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version = ">= 3.4.0,< 3.5.0"
  open_next_version = "v3.5.3"

  providers = {
    aws.server_function = aws.server_function
    aws.iam = aws.iam
    aws.dns = aws.dns
    aws.global = aws.global
  }

  prefix = "${var.prefix}-${data.aws_caller_identity.current.account_id}"
  folder_path = var.open-next-path
}
