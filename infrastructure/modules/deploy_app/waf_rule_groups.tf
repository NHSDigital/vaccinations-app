resource "aws_wafv2_rule_group" "app_rule_group" {
  count = var.is_local ? 0 : 1

  provider = aws.global
  name     = "${var.prefix}-app-rule-group"
  scope    = "CLOUDFRONT"
  capacity = 100 // Adjust capacity based on the number and complexity of rules

  # -----------------------------------------------------------
  # Rule 1: ALLOW if URL path matches any allowed regex
  # -----------------------------------------------------------
  rule {
    name     = "${var.prefix}-allow-whitelisted-uri-paths"
    priority = 1

    action {
      allow {}
    }

    statement {
      regex_pattern_set_reference_statement {
        arn = aws_wafv2_regex_pattern_set.allowed_uri_paths[0].arn

        field_to_match {
          uri_path {}
        }

        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.prefix}-allow-whitelisted-uri-paths"
      sampled_requests_enabled   = false
    }
  }

  # -----------------------------------------------------------
  # Rule 2: ALLOW if session cookie is present
  # -----------------------------------------------------------
  rule {
    name     = "${var.prefix}-check-session-exists"
    priority = 2

    action {
      allow {}
    }

    statement {
      byte_match_statement {
        search_string         = "__Secure-authjs.session-token"
        positional_constraint = "EXACTLY"

        field_to_match {
          cookies {
            match_pattern {
              included_cookies = ["__Secure-authjs.session-token"]
            }
            match_scope       = "KEY"
            oversize_handling = "CONTINUE"
          }
        }

        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.prefix}-check-session-exists"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.prefix}-app-rule-group"
    sampled_requests_enabled   = false
  }
}
