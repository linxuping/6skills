while(true)
do
  date
  mysqldump -uroot -ppwd mydb | gzip > /home/lxp/install/mysqlbak/DatabaseName_$(date +%Y%m%d_%H%M%S).sql.gz
  sleep 14400 #4hours
done


