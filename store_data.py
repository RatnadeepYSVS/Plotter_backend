from mysql import connector#mysql module for python
from dotenv import *#using this module to hide clever cloud console creds
from os import *
from csv import *#we are using this module to retrieve csv data from kaggle csv data file and storing this data in sql db
load_dotenv()
mydb=connector.connect(
    host=getenv('host'),#Online cloud host for mysql db from clever cloud console
    user=getenv('user'),#user cred
    password=getenv('password'),# password cred
    database=getenv('database')#database given no need to create a new database
)
cursor=mydb.cursor()#Creating the cursor
# with open('kaggle_data.csv') as kaggle_data_file:#Using "WITH" context manager to store list of tuples of kaggle csv file
#     f=DictReader(kaggle_data_file)#reads the kaggle csv file
#     data_list=[(c['country'],c['year'],c['value'],c['gas_cat']) for c in f]# storing data from kaggle csv file
# cursor.execute('CREATE TABLE gas_emissions (country VARCHAR(40),year INT(6),value VARCHAR(60),gas_cat VARCHAR(500))')#creating the table gas_emissions
# que="INSERT INTO gas_emissions (country,year,value,gas_cat) VALUES (%s,%s,%s,%s)"#inserting data into table
# cursor.executemany(que,data_list)#executing queries
# mydb.commit()#saving changes to db
cursor.execute("SELECT * FROM gas_emissions")
res=cursor.fetchall()
for x in res:
    print(x)