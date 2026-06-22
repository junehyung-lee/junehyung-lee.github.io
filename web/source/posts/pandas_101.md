# Backgrounds 

Dataframe is used in R to save and load data. The data saved in a daraframe can be indexed for multiple steps required in analysis.  
It is natively supported in R. 

However, in python, dataframe is not natively supported. The python package called 'pandas' can be used to create and store data in python similar to how we do in R.  
First of all, to download and install the package, run the following command in your cmd or terminals:  
python -m pip install pandas

# Import required python library


```python
import pandas as pd
```

To create an empty dataframe using pandas, following code can be used. 


```python
df = pd.DataFrame()
```

We can also add index and columns in the empty dataframe.


```python
df = pd.DataFrame(index=range(5), columns=['A', 'B', 'C', 'D'])

df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>1</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
</div>


