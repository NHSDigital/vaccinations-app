# --- Service Configuration ---
variable "name" {
  description = "The name of the service (e.g., 'fake-api')."
  type        = string
}
variable "image_tag" {
  description = "The tag of the docker image to deploy (e.g., 'latest')."
  type        = string
  default     = "latest"
}
variable "container_port" {
  description = "The port the container listens on."
  type        = number
}
variable "health_check_path" {
  description = "The path for the load balancer health check."
  type        = string
  default     = "/"
}
variable "cpu" {
  description = "The number of CPU units to reserve for the container."
  type        = number
  default     = 256
}
variable "memory" {
  description = "The amount of memory (in MiB) to reserve for the container."
  type        = number
  default     = 512
}

# --- AWS Infrastructure IDs ---
variable "region" {
  description = "The AWS region."
  type        = string
}
variable "vpc_id" {
  description = "The ID of the VPC."
  type        = string
}
variable "private_subnet_ids" {
  description = "A list of private subnet IDs to deploy the service into."
  type        = list(string)
}
variable "ecs_cluster_id" {
  description = "The ID of the ECS cluster."
  type        = string
}
variable "ecs_cluster_name" {
  description = "The name of the ECS cluster."
  type        = string
}
variable "alb_arn" {
  description = "The ARN of the Application Load Balancer."
  type        = string
}
variable "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer."
  type        = string
}
variable "app_root_url" {
  description = "The root URL of the application"
  type        = string
}
variable "alb_security_group_id" {
  description = "The security group ID of the ALB."
  type        = string
}
variable "listener_port" {
  description = "The port for the ALB listener."
  type        = number
  default     = 80
}

# --- IAM Roles ---
variable "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role."
  type        = string
}
variable "ecs_autoscale_role_arn" {
  description = "ARN of the ECS autoscaling role."
  type        = string
}

# --- Autoscaling Configuration ---
variable "min_capacity" {
  description = "The minimum number of tasks for the service."
  type        = number
  default     = 1
}
variable "max_capacity" {
  description = "The maximum number of tasks for the service."
  type        = number
  default     = 16
}
variable "scale_up_threshold_ms" {
  description = "The average response time in milliseconds to trigger a scale-up event."
  type        = number
  default     = 500
}
variable "scale_down_threshold_ms" {
  description = "The average response time in milliseconds to trigger a scale-down event."
  type        = number
  default     = 200
}
variable "cpu_target" {
  description = "Target CPU utilization percentage"
  type        = number
  default     = 65
}
variable "cpu_target_scale_out_cooldown" {
  description = "Seconds to wait before another CPU target scale-out activity"
  type        = number
  default     = 60
}
variable "cpu_target_scale_in_cooldown" {
  description = "Seconds to wait before another CPU target scale-in activity"
  type        = number
  default     = 120
}
