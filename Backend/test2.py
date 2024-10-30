import Urls

# Extract the keys from the symbol_list dictionary properly
symbol_list = list(Urls.Urls.symbol_list.keys())

# Split the symbol list into three parts
s_list1 = symbol_list[:6]
s_list2 = symbol_list[6:13]
s_list3 = symbol_list[13:]

# Print the results
print(f"""
List 1: {s_list1}
List 2: {s_list2}
List 3: {s_list3}
""")
