# Specify the AWS provider and the region
provider "aws" {
  region = var.region
}

# --------------------------------------------------------------------------------------------------
# SHARED IAM ROLES
# --------------------------------------------------------------------------------------------------
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_autoscale_role" {
  name = "${var.project_name}-ecs-autoscale-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "application-autoscaling.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_autoscale_policy" {
  role       = aws_iam_role.ecs_autoscale_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole"
}

# --------------------------------------------------------------------------------------------------
# CALL SHARED INFRASTRUCTURE MODULES
# --------------------------------------------------------------------------------------------------
module "vpc" {
  source             = "./modules/vpc"
  project_name       = var.project_name
  region             = var.region
  availability_zones = var.availability_zones
}

module "ecs_cluster" {
  source       = "./modules/ecs-cluster"
  cluster_name = "${var.project_name}-cluster"
}

module "alb" {
  source            = "./modules/alb"
  name              = "${var.project_name}-alb"
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
}

# --------------------------------------------------------------------------------------------------
# DEPLOY THE FAKE-API SERVICE
# --------------------------------------------------------------------------------------------------
module "fake_api_service" {
  source = "./modules/ecs-service"

  # Service config
  name                = "fake-api"
  container_port      = 9123
  health_check_path   = "/health"
  cpu                 = 256
  memory              = 512

  # Infrastructure config
  region                = var.region
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  ecs_cluster_id        = module.ecs_cluster.cluster_id
  ecs_cluster_name      = module.ecs_cluster.cluster_name
  alb_arn               = module.alb.arn
  alb_security_group_id = module.alb.security_group_id

  # IAM config
  ecs_task_execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  ecs_autoscale_role_arn      = aws_iam_role.ecs_autoscale_role.arn
}
