resource "aws_wafv2_regex_pattern_set" "allowed_uri_paths" {
  name        = "${var.prefix}-allowed-path-patterns"
  description = "Regex patterns for allowed CloudFront URLs"
  scope       = "CLOUDFRONT"
  region      = "us-east-1"

  // static routes served by S3
  regular_expression {
    regex_string = "^/_next/.+"
  }
  regular_expression {
    regex_string = "^/(assets|css|js)/.+"
  }
  regular_expression {
    regex_string = "^/(favicon\\.ico)$"
  }

  // app routes served by Lambda
  regular_expression {
    regex_string = "^/our-policies/(accessibility|cookies-policy)$"
  }
  regular_expression {
    regex_string = "^/(session-logout|session-timeout|sso-failure|service-failure)$"
  }
  regular_expression {
    regex_string = "^/(check-and-book-vaccinations|vaccines-for-all-ages|vaccines-during-pregnancy)$"
  }
  regular_expression {
    regex_string = "^/vaccines/[^/]+"
  }
  regular_expression {
    regex_string = "^/api/(auth/.+|sso|sso-to-nbs|version)$"
  }
  regular_expression {
    regex_string = "^/?$"
  }
}
