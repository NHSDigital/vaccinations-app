resource "aws_route53_zone" "test_private_zone" {
  name = "test.vita.internal"
  vpc {
    vpc_id = module.vpc.vpc_id
  }

  tags = {
    Name = "${var.project_name}-private-zone"
  }
}

resource "aws_route53_record" "record_to_alb" {
  zone_id = aws_route53_zone.test_private_zone.zone_id
  name    = "api"
  type    = "A"

  alias {
    name                   = module.alb.dns_name
    zone_id                = module.alb.zone_id
    evaluate_target_health = true
  }
}
