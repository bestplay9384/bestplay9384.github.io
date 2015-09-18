# Chart drawer
## with jQuery.flot

# How to use
- files with data HAS to be on the server. Loading files with file:// locally does not work - javascript fault. http:// links are allowed!
- GET parameter "files" stores chart content data pointers. How to use it?
	- there are used 3 parameters per chart
	- FILE_WITH_DATA.ext:LABEL_FOR_CHART:NUMBER_OF_Y_AXIS
	- every data part has to be insulated by ";" sign.
	- NUMBER_OF_Y_AXIS - if the same in every data part, they will have the same Y Axis.

# Example usage:
1)
```bash
./index.html?files=FILE1.txt,Label1,1
```
means load data from FILE1.txt (it can be full URL), make label Label1 for this data on chart and use percentage Y Axis (1 means that)

2)
```bash
./index.html?files=FILE1.txt,Label1,1;FILE2.txt,Label2,1
```
means:
- load data from FILE1.txt labelled with Label1 and use percentage Y Axis
- load data from FILE2.txt labelled with Label2 and use the sane percentage Y Axis

3)
```bash
./index.html?files=FILE1.txt,Label1,1;FILE2.txt,Label2,1;FILE3.txt,Label3,2
```
means:
- all the same like in 2nd example
- load data from FILE3.txt labelled with Label3 and create new Y Axis (numerical, not percentage);

Every Y Axis number that is greater than 1 (>1) in numerical, only the number 1 is Percentage.
