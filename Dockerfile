# production environment
#FROM openjdk
FROM containers.cisco.com/jenkins_rialto_gen/rialto-santana:component_build_docker_base_image_java8.322

LABEL maintainer=“saibogga@cisco.com”

COPY build/libs/demo-0.0.1-SNAPSHOT.jar /usr/

WORKDIR /usr/

RUN echo "Asia/Kolkata" > /etc/timezone
#RUN dpkg-reconfigure -f noninteractive tzdata
EXPOSE 8080

CMD java -jar demo-0.0.1-SNAPSHOT.jar
