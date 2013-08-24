import os;

def main() :
   
    files = [];
    
    for file in os.listdir("../lib") :
        if file.count(".js") == 1 :
            files.append("../lib/" + file);
    
    for file in os.listdir("../src") :
        if file.count(".js") == 1 :
            files.append("../src/" + file);
	
    files.append("../src/utils/MathUtil.js");
    command = "java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS";
    
    for file in files:
        command += " --js " + file;

    command += " --js_output_file .temp --accept_const_keyword";
    os.system(command);
    
    file = open("../test.html", "r");
    lines = file.readlines();
    file.close();
    
    index = 0;
    i = 0;
    while (i < len(lines)) :
		if lines[i].count("type=\"text/javascript\" src=") == 1 :
			del lines[i];
			index = i;
			i = i - 1;
		i = i + 1;

    file = open(".temp", "r")
    lines.insert(index, "\t<script>" + file.read() + "</script>\n");
    file.close();
    os.remove(".temp");
    
    data = ""
    for line in lines :
        data = data + line;
    
    file = open("../index.html", "w");
    file.write(data);
    file.close();
    
if __name__ == "__main__":
    main();