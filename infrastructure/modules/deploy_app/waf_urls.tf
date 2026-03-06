resource "aws_wafv2_regex_pattern_set" "allowed_uri_paths" {
  count = var.is_local ? 0 : 1

  name        = "${var.prefix}-allowed-path-patterns"
  description = "Regex patterns for allowed CloudFront URLs"
  scope       = "CLOUDFRONT"
  region      = "us-east-1"

  dynamic "regular_expression" {
    for_each = jsondecode(file("${path.module}/configs/uri-path-regex.json"))
    content {
      regex_string = regular_expression.value
    }
  }
}
