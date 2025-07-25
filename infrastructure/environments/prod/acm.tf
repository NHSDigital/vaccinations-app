data "aws_acm_certificate" "website" {
  provider    = aws.global
  domain      = local.domain
  key_types   = ["RSA_2048"]
  statuses    = ["ISSUED"]
  types       = ["AMAZON_ISSUED"]
  most_recent = true
  tags = {
    Project = local.project_identifier
  }
}
