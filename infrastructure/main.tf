module "vaccinations-app-bundle" {
  source  = "nhs-england-tools/opennext/aws"
  version = "1.0.6" # Use the latest release from https://github.com/nhs-england-tools/terraform-aws-opennext/releases

  prefix              = var.project_identifier_shortcode    # Prefix for all created resources
  opennext_build_path = "../.open-next"                     # Path to your .open-next folder
  hosted_zone_id      = data.aws_route53_zone.zone.zone_id  # The Route53 hosted zone ID for your domain name

  cloudfront = {
    aliases             = [local.domain_name]                                             # Your domain name
    acm_certificate_arn = aws_acm_certificate_validation.ssl_certificate.certificate_arn  # The ACM (SSL) certificate for your domain
  }
}
