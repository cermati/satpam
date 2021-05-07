@Library('cermati-ci')
import org.cermati.infra.jenkins.cicd.pipeline.DefaultRepositoryPipelineV1
import org.cermati.infra.jenkins.cicd.utils.PipelineUtils

// Constants
def CONFIG_FILE = 'jenkins.yml'

// From build parameters
def GIT_REPO_URL = GIT_REPO_URL
def GIT_COMMIT = GIT_COMMIT
def GIT_WEBHOOK_PAYLOAD = GIT_WEBHOOK_PAYLOAD

// Pipeline configurations, configured from build parameters
def nodeLabel = PipelineUtils.defaultClosure('') { NODE_LABEL }

node(label: nodeLabel) {
    def defaultRepositoryPipeline = new DefaultRepositoryPipelineV1(
        this,
        DEFAULT_GITHUB_CREDENTIAL_ID,
        GIT_REPO_URL,
        GIT_COMMIT,
        GIT_WEBHOOK_PAYLOAD,
        DEFAULT_DOCKER_REGISTRIES,
        DEFAULT_SLACK_TOKEN_CREDENTIAL_ID,
        CONFIG_FILE
    )

    def runner = defaultRepositoryPipeline.createPipelineRunner()
    runner.run()
}
