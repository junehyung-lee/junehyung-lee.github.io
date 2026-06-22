import pandas as pd
import matplotlib.pyplot as plt

import dataframe_image as dfi

data = pd.read_csv('https://gist.githubusercontent.com/ZeccaLehn/4e06d2575eb9589dbe8c365d61cb056c/raw/64f1660f38ef523b2a1a13be77b002b98665cdfe/mtcars.csv')
colnames = data.columns

colnames = ['Models', 'MPG', 'Cylinders', 'Displacement', 'Horsepowers', 'Rear axle ratio', 'Weight (per 1000 lbs)', 'Quater mile time', 'V-shape', 'Transmission type', 'Gears', 'Carburetors']
data.columns = colnames 

data_head = data.head()

dfi.export(data_head, 'table_mtcars.png', dpi=300)

fig, ax = plt.subplots(figsize=(8, 6))

ax.scatter(x=data['wt'], y=data['mpg'], c=data['vs'])

ax.set_xlabel('Weight of vehicle (per 1,000 lbs)', fontsize=15)
ax.set_ylabel('Miles per gallon (mpg)', fontsize=15)

ax.tick_params(axis='both', labelsize=15)

plt.tight_layout()
plt.show()
plt.savefig('mtcars-wt_mpg-with_colors.png', dpi=300)