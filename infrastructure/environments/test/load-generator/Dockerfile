FROM openjdk:11

# Install JMeter
RUN wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz && \
    tar -xzf apache-jmeter-5.6.3.tgz && \
    mv apache-jmeter-5.6.3 /opt/jmeter && \
    rm apache-jmeter-5.6.3.tgz

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

# Add JMeter to PATH
ENV PATH=$PATH:/opt/jmeter/bin

# Copy entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
