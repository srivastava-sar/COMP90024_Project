##Install the packages using the below lines. 
#install.packages("rjson")
#install.packages("utils")
#install.packages("scales")

##Import Aurin json
library(rjson)
aurin_data = fromJSON(file = "C:/Users/anshj/Desktop/Cluster and Cloud Computing/Assignments/Assignment 2/output.json")
##Import Tweet .csv
library(utils)
Tweet_data = read.csv(file = "C:/Users/anshj/Desktop/Cluster and Cloud Computing/Assignments/Assignment 2/TwitterSentiment.CSV", header = TRUE)

##Update Aurin Data
aurin_data = do.call("rbind", lapply(aurin_data, as.data.frame))
aurin_data$City = tolower(aurin_data$City) 
aurin_data = aurin_data[order(aurin_data$City), ]
Not_obese = (100 - as.numeric(levels(aurin_data$Obese))[aurin_data$Obese])
Not_obese_std = (Not_obese-mean(Not_obese))/sd(Not_obese)
Not_obese = Not_obese/100
Physically_active = 100 - as.numeric(levels(aurin_data$PhyInac))[aurin_data$PhyInac]
Physically_active_std = (Physically_active-mean(Physically_active))/sd(Physically_active)
Physically_active = Physically_active/100
Not_overweight = 100 - as.numeric(levels(aurin_data$OverWeight))[aurin_data$OverWeight]
Not_overweight_std = (Not_overweight-mean(Not_overweight))/sd(Not_overweight)
Not_overweight = Not_overweight/100
Not_smokers = 100 - as.numeric(levels(aurin_data$Smokers))[aurin_data$Smokers]
Not_smokers_std = (Not_smokers-mean(Not_smokers))/sd(Not_smokers)
Not_smokers = Not_smokers/100

##QQ-Plots for the above metrics
jpeg("QQ-Plot_Not_Obese.jpeg", width = 550, height = 550)
qqnorm(Not_obese, main = "Normal QQ-Plot for % of population that is not obese")
qqline(Not_obese)
dev.off()

jpeg("QQ-Plot_Not_Overweight.jpeg", width = 550, height = 550)
qqnorm(Not_overweight, main = "Normal QQ-Plot for % of population that is not obese")
qqline(Not_overweight)
dev.off()

jpeg("QQ-Plot_Physically_Active.jpeg", width = 550, height = 550)
qqnorm(Physically_active, main = "Normal QQ-Plot for % of population that is not obese")
qqline(Physically_active)
dev.off()

jpeg("QQ-Plot_Not_Smoker.jpeg", width = 550, height = 550)
qqnorm(Not_smokers, main = "Normal QQ-Plot for % of population that is not obese")
qqline(Not_smokers)
dev.off()

##Update Twitter Sentiment Data
Tweet_data$City = tolower(Tweet_data$City)
Tweet_data = Tweet_data[order(Tweet_data$City), ]


##Create Metrics from Twitter Sentiment Data
Positive_sentiment = Tweet_data$POS_Count/(Tweet_data$POS_Count+Tweet_data$Neu_Count+Tweet_data$NEG_Count)
Net_positive = (Tweet_data$POS_Count - Tweet_data$NEG_Count)/(Tweet_data$POS_Count+Tweet_data$Neu_Count+Tweet_data$NEG_Count)

# jpeg("QQ-Plot_Positive_sentiment", width = 350, height = 350)
# qqnorm(Positive_sentiment)
# qqline(Positive_sentiment)
# dev.off()
# 
# jpeg("QQ-Plot_Net_Positive_sentiment", width = 350, height = 350)
# qqnorm(Net_positive)
# qqline(Net_positive)
# dev.off()

#Create Regression Models using both the data sets
reg_not_obese = lm(Positive_sentiment ~ Not_obese + 0)
reg_not_overweight = lm(Positive_sentiment ~ Not_overweight + 0)
reg_physically_active = lm(Positive_sentiment ~ Physically_active + 0)
reg_not_smoker = lm(Positive_sentiment ~ Not_smokers + 0)

##Plot for Positive Sentiment vs. Percent of population that is not obese
jpeg("Positive_vs_Obese.jpeg", width = 350, height = 350)
par(fig=c(0,0.8,0,0.8), new=TRUE)
plot(x = Positive_sentiment, y = Not_obese, xlab = "% of Positive Sentiment", ylab = "% of Population that is not obese", ylim = c(0,1))
abline(reg_not_obese)
par(fig=c(0,0.8,0.55,1), new=TRUE)
boxplot(Positive_sentiment, horizontal=TRUE, axes=FALSE)
par(fig=c(0.65,1,0,0.8),new=TRUE)
boxplot(Not_obese, axes=FALSE)
dev.off()

jpeg("Positive_vs_Overweight.jpeg", width = 350, height = 350)
par(fig=c(0,0.8,0,0.8), new=TRUE)
plot(x = Positive_sentiment, y = Not_overweight, xlab = "% of Positive Sentiment", ylab = "% of Population that is not overweight", ylim = c(0,1))
abline(reg_not_overweight)
par(fig=c(0,0.8,0.55,1), new=TRUE)
boxplot(Positive_sentiment, horizontal=TRUE, axes=FALSE)
par(fig=c(0.65,1,0,0.8),new=TRUE)
boxplot(Not_overweight, axes=FALSE)
dev.off()

jpeg("Positive_vs_PhysicalActivity.jpeg", width = 350, height = 350)
par(fig=c(0,0.8,0,0.8), new=TRUE)
plot(x = Positive_sentiment, y = Physically_active, xlab = "% of Positive Sentiment", ylab = "% of Population that is physically active", ylim = c(0,1))
abline(reg_physically_active)
par(fig=c(0,0.8,0.55,1), new=TRUE)
boxplot(Positive_sentiment, horizontal=TRUE, axes=FALSE)
par(fig=c(0.65,1,0,0.8),new=TRUE)
boxplot(Physically_active, axes=FALSE)
dev.off()

jpeg("Positive_vs_Smoker.jpeg", width = 350, height = 350)
par(fig=c(0,0.8,0,0.8), new=TRUE)
plot(x = Positive_sentiment, y = Not_smokers, xlab = "% of Positive Sentiment", ylab = "% of Population that doesn't smoke", ylim = c(0,1))
abline(reg_not_smoker)
par(fig=c(0,0.8,0.55,1), new=TRUE)
boxplot(Positive_sentiment, horizontal=TRUE, axes=FALSE)
par(fig=c(0.65,1,0,0.8),new=TRUE)
boxplot(Not_smokers, axes=FALSE)
dev.off()

##Create Importance Model
Importance = lm(Positive_sentiment ~ Not_obese_std + Not_overweight_std + Physically_active_std + Not_smokers_std+0)
Importance_list = abs(Importance$coefficients)/sum(abs(Importance$coefficients))
Importance_matrix = matrix(Importance_list)

library(scales)
obese_legend = paste("Not Obese: ", percent(Importance_matrix[1]))
overweight_legend = paste("Not Overweight: ", percent(Importance_matrix[2]))
physical_legend = paste("Physically Active: ", percent(Importance_matrix[3]))
smoker_legend = paste("Not a smoker: ", percent(Importance_matrix[4]))


barplot(Importance_matrix, beside = FALSE, legend = c(obese_legend, overweight_legend, physical_legend, smoker_legend))
dev.off()