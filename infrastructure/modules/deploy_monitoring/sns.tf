module "sns" {
  source  = "terraform-aws-modules/sns/aws"
  version = "~> 6.2.0"

  name          = "${var.prefix}-cloudwatch-alarms"
  display_name  = "VitA Cloudwatch Alarms"

  tags  = var.default_tags

  # delivery_policy
  # subscriptions
}
