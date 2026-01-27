module "sns" {
  source  = "terraform-aws-modules/sns/aws"
  version = "~> 6.2.0"

  name         = "${var.prefix}-cloudwatch-alarms"
  display_name = "VitA Cloudwatch Alarms"

  tags = var.default_tags

  # delivery_policy
  # subscriptions
}

module "sns_global" {
  source  = "terraform-aws-modules/sns/aws"
  version = "~> 6.2.0"
  providers = {
    aws = aws.global
  }

  name         = "${var.prefix}-cloudwatch-alarms-global"
  display_name = "VitA Cloudwatch Alarms Global"

  tags = var.default_tags

  # delivery_policy
  # subscriptions
}
