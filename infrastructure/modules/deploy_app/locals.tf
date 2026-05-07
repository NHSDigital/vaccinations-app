locals {
  aws_managed_rule_groups = [
    {
      name                = "${var.prefix}-amazon-ip-reputation-list"
      priority            = 0
      aws_rule_group_name = "AWSManagedRulesAmazonIpReputationList"
    },
    {
      name                = "${var.prefix}-known-bad-inputs"
      priority            = 1
      aws_rule_group_name = "AWSManagedRulesKnownBadInputsRuleSet"
    },
    {
      name                = "${var.prefix}-common-rule-set"
      priority            = 2
      aws_rule_group_name = "AWSManagedRulesCommonRuleSet"
    },
    {
      name                = "${var.prefix}-linux-rule-set"
      priority            = 3
      aws_rule_group_name = "AWSManagedRulesLinuxRuleSet"
    },
    {
      name                = "${var.prefix}-unix-rule-set"
      priority            = 4
      aws_rule_group_name = "AWSManagedRulesUnixRuleSet"
    }
  ]
}
