library(tufte)
library(tidyverse)
library(data.table)
library(dplyr)

# Store the data in a variable called df.
df = read.csv("GOOG.csv", stringsAsFactors=FALSE)
str(df)

df$Date <- as.Date(df$Date,format="%d/%m/%Y")
str(df)

# Output a summary of the data
df %>% summary()

library(tidyverse)
library(plotly)
library(reshape2)

# Make a scatterplot using ggplot 
ggplot(df, aes(x=Date, y=Close)) +
  geom_point(size=2, shape=23) +
  geom_smooth(method='lm',formula=y~x)

# Generate lags of "Close"
library(rlang)

multi_lag <- function(df, lags, var, postfix="") {
  var <- enquo(var)
  quosures <- map(lags, ~quo(lag(!!var, !!.x))) %>%
    set_names(paste0(quo_text(var), postfix, lags))
  return(mutate(group_by(df), !!!quosures))
}

df.close20 <- multi_lag(df, 1:20, Close, "_l")

# removing rows with missing values
df.close20 <- na.omit(df.close20)

# Split into training and testing data
library(lubridate)
# Training data: We'll use data released in in 2018 Q1 - 2018 Q3
train.close20 <- filter(df.close20, month(Date) < 9)

# Testing data: We'll use data released in 2018 Q4
test.close20 <- filter(df.close20, month(Date) >= 9)

# checking corelation between features

cor(train.close20[,c("Close","Close_l1","Close_l2","Close_l3", "Close_l4")],
    use="complete.obs")

# linear regression model

mod1 <- lm(Close ~ Close_l1 + Close_l2 + Close_l3 + Close_l4 + Close_l5 + Close_l6 + Close_l7 
           + Close_l8 + Close_l9 + Close_l10, data=train.close20)
summary(mod1)

mod2 <- lm(Close ~ Close_l1 + Close_l2 + Close_l3 + Close_l4 + Close_l5 + Close_l6 + Close_l7 
           + Close_l8 + Close_l9 + Close_l10 + Close_l11 + Close_l12 + Close_l13 
           + Close_l14 + Close_l15 + Close_l16 + Close_l17 + Close_l18 + Close_l19
           + Close_l20, data=train.close20)
summary(mod2)

mod3 <- lm(Close ~., data=train.close20)
summary(mod3)

# accuracy measures
rmse <- function(v1, v2) {
  sqrt(mean((v1 - v2)^2, na.rm=T))
}

mod1.acc = rmse(test.close20$Close, predict(mod1, newdata=test.close20))
print(paste0("rmse score of mod1 is ", + mod1.acc))
ggplot() +
  geom_point(data = test.close20, aes(x = Date, y = Close), color = "blue", size=2, shape=23) +
  geom_point(data = test.close20, aes(x = Date, predict(mod1, newdata=test.close20)), 
             color = "red", size=2, shape=23)
  

mod2.acc = rmse(test.close20$Close, predict(mod2, newdata=test.close20))
print(paste0("rmse score of mod2 is ", + mod2.acc))
ggplot() +
  geom_point(data = test.close20, aes(x = Date, y = Close), color = "blue", size=2, shape=23) +
  geom_point(data = test.close20, aes(x = Date, predict(mod2, newdata=test.close20)), 
             color = "red", size=2, shape=23)

mod3.acc = rmse(test.close20$Close, predict(mod3, newdata=test.close20))
print(paste0("rmse score of mod3 is ", + mod3.acc))
ggplot() +
  geom_point(data = test.close20, aes(x = Date, y = Close), color = "blue", size=2, shape=23) +
  geom_point(data = test.close20, aes(x = Date, predict(mod3, newdata=test.close20)), 
             color = "red", size=2, shape=23)




