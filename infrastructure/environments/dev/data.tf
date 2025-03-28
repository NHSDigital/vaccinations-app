data "external" "git_branch" {
  program = ["bash", "${path.module}/../../scripts/get_git_branch.sh"]
}
