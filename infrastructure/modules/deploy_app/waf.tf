resource "aws_wafv2_web_acl" "app_waf" {
  count = var.is_local ? 0 : 1

  name        = "${var.prefix}-cloudfront-waf"
  scope       = "CLOUDFRONT"
  description = "WAF ACL for CloudFront with managed aws rules, URI allowlist, session check"
  region      = "us-east-1"

  default_action {
    block {
      custom_response {
        response_code = 302
        response_header {
          name  = "Location"
          value = var.application_environment_variables.NHS_APP_REDIRECT_LOGIN_URL
        }
      }
    }
  }

  dynamic "rule" {
    for_each = local.aws_managed_rule_groups
    content {
      name     = rule.value.name
      priority = rule.value.priority

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = rule.value.aws_rule_group_name
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = rule.value.name
        sampled_requests_enabled   = false
      }
    }
  }

  rule {
    name     = "${var.prefix}-app-rule-group"
    priority = tostring(length(local.aws_managed_rule_groups) + 1)

    override_action {
      none {}
    }

    statement {
      rule_group_reference_statement {
        arn = aws_wafv2_rule_group.app_rule_group[0].arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.prefix}-app-rule-group"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cloudfront-waf"
    sampled_requests_enabled   = false
  }
}
