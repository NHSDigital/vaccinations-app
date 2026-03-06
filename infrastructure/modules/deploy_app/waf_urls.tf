resource "aws_wafv2_regex_pattern_set" "allowed_uri_paths" {
  count = var.is_local ? 0 : 1

  provider    = aws.global
  name        = "${var.prefix}-allowed-path-patterns"
  description = "Regex patterns for allowed CloudFront URLs"
  scope       = "CLOUDFRONT"

  dynamic "regular_expression" {
    for_each = jsondecode(file("${path.module}/configs/uri-path-regex.json"))
    content {
      regex_string = regular_expression.value
    }
  }
}
