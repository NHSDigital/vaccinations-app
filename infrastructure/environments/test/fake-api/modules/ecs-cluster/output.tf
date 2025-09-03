output "cluster_id" {
  description = "The ID of the ECS cluster."
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "The name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}
