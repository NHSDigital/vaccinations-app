data "external" "git_branch" {
  program = ["bash", "${path.module}/../../scripts/get_git_branch.sh"]
}

data "external" "deploy_source" {
  program = ["bash", "${path.module}/../../scripts/get_deploy_source.sh"]
}
