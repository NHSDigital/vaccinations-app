resource "aws_ecr_repository" "load_generator" {
  name = local.project
  tags = {
    Name = "${local.project}-repo"
  }
}
