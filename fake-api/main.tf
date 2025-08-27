# --------------------------------------------------------------------------------------------------
# TERRAFORM PROVIDER CONFIGURATION
# --------------------------------------------------------------------------------------------------
# Specify the AWS provider and the region where the resources will be created.
# To use a specific AWS profile, set the AWS_PROFILE environment variable
# in your terminal before running terraform. Example: export AWS_PROFILE="your-profile-name"
provider "aws" {
  region  = "eu-west-2" # You can change this to your desired region
}
# --------------------------------------------------------------------------------------------------
# NETWORKING (VPC)
# --------------------------------------------------------------------------------------------------
# Create a new VPC for our Fargate service.
resource "aws_vpc" "spike_fake_api_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true # Required for VPC Endpoints with private DNS
  enable_dns_hostnames = true # Required for VPC Endpoints with private DNS
  tags = {
    Name = "fake-api-vpc"
  }
}

# --- Public Subnets for Load Balancer ---
resource "aws_subnet" "fake_api_public_subnet_a" {
  vpc_id            = aws_vpc.spike_fake_api_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "eu-west-2a"
  map_public_ip_on_launch = true
  tags = {
    Name = "fake-api-public-subnet-a"
  }
}
resource "aws_subnet" "fake_api_public_subnet_b" {
  vpc_id            = aws_vpc.spike_fake_api_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "eu-west-2b"
  map_public_ip_on_launch = true
  tags = {
    Name = "fake-api-public-subnet-b"
  }
}

# --- Private Subnets for Fargate Tasks ---
resource "aws_subnet" "fake_api_private_subnet_a" {
  vpc_id            = aws_vpc.spike_fake_api_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "eu-west-2a"
  tags = {
    Name = "fake-api-private-subnet-a"
  }
}
resource "aws_subnet" "fake_api_private_subnet_b" {
  vpc_id            = aws_vpc.spike_fake_api_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "eu-west-2b"
  tags = {
    Name = "fake-api-private-subnet-b"
  }
}

# --- Internet Gateway and Public Routing ---
resource "aws_internet_gateway" "fake_api_gw" {
  vpc_id = aws_vpc.spike_fake_api_vpc.id
  tags = {
    Name = "fake-api-igw"
  }
}
resource "aws_route_table" "fake_api_public_route_table" {
  vpc_id = aws_vpc.spike_fake_api_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.fake_api_gw.id
  }
  tags = {
    Name = "fake-api-public-rt"
  }
}
resource "aws_route_table_association" "fake_api_public_route_table_association_a" {
  subnet_id      = aws_subnet.fake_api_public_subnet_a.id
  route_table_id = aws_route_table.fake_api_public_route_table.id
}
resource "aws_route_table_association" "fake_api_public_route_table_association_b" {
  subnet_id      = aws_subnet.fake_api_public_subnet_b.id
  route_table_id = aws_route_table.fake_api_public_route_table.id
}

# --- Private Routing (no NAT Gateway needed) ---
resource "aws_route_table" "fake_api_private_route_table" {
  vpc_id = aws_vpc.spike_fake_api_vpc.id
  tags = {
    Name = "fake-api-private-rt"
  }
}
resource "aws_route_table_association" "fake_api_private_route_table_association_a" {
  subnet_id      = aws_subnet.fake_api_private_subnet_a.id
  route_table_id = aws_route_table.fake_api_private_route_table.id
}
resource "aws_route_table_association" "fake_api_private_route_table_association_b" {
  subnet_id      = aws_subnet.fake_api_private_subnet_b.id
  route_table_id = aws_route_table.fake_api_private_route_table.id
}

# --------------------------------------------------------------------------------------------------
# VPC ENDPOINTS
# --------------------------------------------------------------------------------------------------
# Security group to allow traffic from Fargate tasks to the VPC endpoints
resource "aws_security_group" "vpc_endpoint_sg" {
  name        = "fake-api-vpc-endpoint-sg"
  description = "Allow HTTPS traffic to VPC endpoints"
  vpc_id      = aws_vpc.spike_fake_api_vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [aws_security_group.fake_api_sg.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "fake-api-vpc-endpoint-sg"
  }
}

# S3 Gateway Endpoint: Allows ECR to pull image layers from S3
resource "aws_vpc_endpoint" "s3_gateway" {
  vpc_id       = aws_vpc.spike_fake_api_vpc.id
  service_name = "com.amazonaws.eu-west-2.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids = [aws_route_table.fake_api_private_route_table.id]
  tags = {
    Name = "fake-api-s3-gateway-endpoint"
  }
}

# ECR API Interface Endpoint: Allows Fargate to get authorization tokens
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = aws_vpc.spike_fake_api_vpc.id
  service_name        = "com.amazonaws.eu-west-2.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = [aws_subnet.fake_api_private_subnet_a.id, aws_subnet.fake_api_private_subnet_b.id]
  security_group_ids  = [aws_security_group.vpc_endpoint_sg.id]
  tags = {
    Name = "fake-api-ecr-api-endpoint"
  }
}

# ECR DKR Interface Endpoint: Allows Fargate to pull the actual docker image
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = aws_vpc.spike_fake_api_vpc.id
  service_name        = "com.amazonaws.eu-west-2.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = [aws_subnet.fake_api_private_subnet_a.id, aws_subnet.fake_api_private_subnet_b.id]
  security_group_ids  = [aws_security_group.vpc_endpoint_sg.id]
  tags = {
    Name = "fake-api-ecr-dkr-endpoint"
  }
}

# CloudWatch Logs Interface Endpoint: Allows Fargate to send logs
resource "aws_vpc_endpoint" "logs" {
  vpc_id              = aws_vpc.spike_fake_api_vpc.id
  service_name        = "com.amazonaws.eu-west-2.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  subnet_ids          = [aws_subnet.fake_api_private_subnet_a.id, aws_subnet.fake_api_private_subnet_b.id]
  security_group_ids  = [aws_security_group.vpc_endpoint_sg.id]
  tags = {
    Name = "fake-api-logs-endpoint"
  }
}

# --------------------------------------------------------------------------------------------------
# CONTAINER REGISTRY (ECR)
# --------------------------------------------------------------------------------------------------
# Create an ECR repository to store our Docker image.
resource "aws_ecr_repository" "fake_api_repo" {
  name = "my-fake-api-app" # Name your repository
  tags = {
    Name = "fake-api-repo"
  }
}
# --------------------------------------------------------------------------------------------------
# PERMISSIONS (IAM)
# --------------------------------------------------------------------------------------------------
# IAM role that allows ECS tasks to make API calls to other AWS services.
resource "aws_iam_role" "fake_api_ecs_task_execution_role" {
  name = "fake_api_ecs_task_execution_role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  tags = {
    Name = "fake-api-ecs-task-execution-role"
  }
}
# Attach the AmazonECSTaskExecutionRolePolicy to the role.
# This policy provides the necessary permissions for ECS to pull images from ECR and send logs to CloudWatch.
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.fake_api_ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
# --------------------------------------------------------------------------------------------------
# LOGGING (CLOUDWATCH)
# --------------------------------------------------------------------------------------------------
# Create a CloudWatch Log Group for our container logs.
resource "aws_cloudwatch_log_group" "fake_api_logs" {
  name = "/ecs/fake-api"

  tags = {
    Name = "fake-api-log-group"
  }
}
# --------------------------------------------------------------------------------------------------
# LOAD BALANCER
# --------------------------------------------------------------------------------------------------
# Create an Application Load Balancer
resource "aws_lb" "fake_api_lb" {
  name               = "fake-api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.fake_api_lb_sg.id]
  # The ALB must be in public subnets to be accessible from the internet
  subnets            = [aws_subnet.fake_api_public_subnet_a.id, aws_subnet.fake_api_public_subnet_b.id]
  tags = {
    Name = "fake-api-lb"
  }
}
# Create a target group for the load balancer.
resource "aws_lb_target_group" "fake_api_lb_target_group" {
  name        = "fake-api-lb-tg"
  port        = 9123
  protocol    = "HTTP"
  vpc_id      = aws_vpc.spike_fake_api_vpc.id
  target_type = "ip"
  health_check {
    path                = "/health"
    protocol            = "HTTP"
    port                = "traffic-port"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
    matcher             = "200" # Expect a 200 OK status
  }
  tags = {
    Name = "fake-api-lb-tg"
  }
}
# Create a listener for the load balancer.
resource "aws_lb_listener" "fake_api_lb_listener_http" {
  load_balancer_arn = aws_lb.fake_api_lb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fake_api_lb_target_group.arn
  }
}
# --------------------------------------------------------------------------------------------------
# ECS CLUSTER
# --------------------------------------------------------------------------------------------------
# Create an ECS cluster. This is a logical grouping of tasks or services.
resource "aws_ecs_cluster" "fake_api_ecs_cluster" {
  name = "fake-api-ecs-cluster"
  tags = {
    Name = "fake-api-ecs-cluster"
  }
}
# --------------------------------------------------------------------------------------------------
# ECS TASK DEFINITION
# --------------------------------------------------------------------------------------------------
# Define the ECS task. This is the blueprint for our application.
resource "aws_ecs_task_definition" "fake_api_task" {
  family                   = "fake-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # 0.25 vCPU
  memory                   = "512"  # 512MB
  execution_role_arn       = aws_iam_role.fake_api_ecs_task_execution_role.arn
  # Define the container to run.
  container_definitions = jsonencode([
    {
      name      = "fake-api-container"
      image     = "${aws_ecr_repository.fake_api_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 9123
          hostPort      = 9123
        }
      ]
      # Add log configuration to send container output to CloudWatch.
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.fake_api_logs.name
          "awslogs-region"        = "eu-west-2"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
  tags = {
    Name = "fake-api-task-def"
  }
}
# --------------------------------------------------------------------------------------------------
# ECS SERVICE
# --------------------------------------------------------------------------------------------------
# Create the ECS service. This will run and maintain the desired number of tasks.
resource "aws_ecs_service" "fake_api_ecs_service" {
  name            = "fake-api-ecs-service"
  cluster         = aws_ecs_cluster.fake_api_ecs_cluster.id
  task_definition = aws_ecs_task_definition.fake_api_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  # Give the task time to start before the ALB starts health checks
  health_check_grace_period_seconds = 30

  network_configuration {
    # Place tasks in the private subnets
    subnets         = [aws_subnet.fake_api_private_subnet_a.id, aws_subnet.fake_api_private_subnet_b.id]
    security_groups = [aws_security_group.fake_api_sg.id]
    # Tasks in private subnets should not have public IPs
    assign_public_ip = false
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.fake_api_lb_target_group.arn
    container_name   = "fake-api-container"
    container_port   = 9123
  }
  # This ensures the service waits for the IGW to be created before starting.
  depends_on = [
    aws_lb_listener.fake_api_lb_listener_http,
    aws_lb_target_group.fake_api_lb_target_group
  ]
  tags = {
    Name = "fake-api-ecs-service"
  }
}
# --------------------------------------------------------------------------------------------------
# SECURITY
# --------------------------------------------------------------------------------------------------
# Security group for the Load Balancer.
resource "aws_security_group" "fake_api_lb_sg" {
  name        = "fake-api-lb-sg"
  description = "Allow inbound HTTP traffic to LB"
  vpc_id      = aws_vpc.spike_fake_api_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "fake-api-lb-sg"
  }
}

# Security group for the Fargate Service
resource "aws_security_group" "fake_api_sg" {
  name        = "fake-api-service-sg"
  description = "Allow inbound traffic to Fargate service"
  vpc_id      = aws_vpc.spike_fake_api_vpc.id

  ingress {
    from_port       = 9123
    to_port         = 9123
    protocol        = "tcp"
    security_groups = [aws_security_group.fake_api_lb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "fake-api-service-sg"
  }
}
# --------------------------------------------------------------------------------------------------
# OUTPUTS
# --------------------------------------------------------------------------------------------------
# Output the URL of the ECR repository.
output "ecr_repository_url" {
  value = aws_ecr_repository.fake_api_repo.repository_url
}
# Output the public URL of the application.
output "application_url" {
  description = "The public URL of the application"
  value       = "http://${aws_lb.fake_api_lb.dns_name}"
}
# Note: The public IP of the Fargate task is dynamic.
# You can find it in the AWS Management Console in the ECS service's task details.
