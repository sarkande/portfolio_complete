FROM maven:3.9.9-eclipse-temurin-21 AS build

# Définir le répertoire de travail pour la phase de construction
WORKDIR /app

# Copier les fichiers de projet Maven
COPY pom.xml .
COPY src ./src

# Construire l'application + test (même si les tests sont déjà exécutés dans le pipeline)
RUN mvn clean package -DskipTests

# Utiliser une image Java 21 pour exécuter l'application
FROM eclipse-temurin:21-jdk-alpine

# Définir le répertoire de travail pour l'exécution
WORKDIR /app

# Copier le fichier JAR généré depuis l'étape de construction
# Ameliorable ave un * mais je ne sais pas si plusieurs .jar peuvent être générés
COPY --from=build /app/target/portfolio-0.0.1-SNAPSHOT.jar /app/portfolio.jar

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "portfolio.jar"]