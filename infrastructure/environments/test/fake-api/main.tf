# Specify the AWS provider and the region
provider "aws" {
  region = var.region
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

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
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

  # IAM config (now using outputs from the iam module)
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  ecs_autoscale_role_arn      = module.iam.ecs_autoscale_role_arn
}
