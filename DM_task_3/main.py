class DiscreteFramework:
    def __init__(self) -> None:
        pass

    def manual_contains(self, element, collection):
        for item in collection:
            if item == element:
                return True
        return False
    
    def get_cardinality(self, collection):
        count = 0
        for _ in collection:
            count += 1
        return count
        
    def create_set(self, elements_list):
        unique_list = []
        for x in elements_list:
            if not self.manual_contains(x,unique_list):
                unique_list.append(x)
        return unique_list
    
    def get_multiplicity(self, element, multiset):
        count =0
        for item in multiset:
            if item == element:
                count += 1
        return count

    def multiset_union(self, A, B):
        result = []
        all_elements = self.union(self.create_set(A), self.create_set(B))

        for x in all_elements:
            count_a = self.get_multiplicity(x, A)
            count_b = self.get_multiplicity(x, B)

            for _ in range(max(count_a, count_b)):
                result.append(x)
        return result

    def multiset_intersection(self, A, B):
        result = []
        all_elements = self.union(self.create_set(A), self.create_set(B))
        
        for x in all_elements:
            count_a = self.get_multiplicity(x, A)
            count_b = self.get_multiplicity(x, B)

            for _ in range(min(count_a, count_b)):
                result.append(x)

        return result

    def multiset_sum(self, A, B):
        result = []
        for x in A: result.append(x)
        for x in B: result.append(x)
        return result
    
    def generate_truth_table(self, formula, variables):
        n = self.get_cardinality(variables)
        num_rows = 1 << n

        header = '|'.join(variables) + " | Result"
        print(header)
        print("-"*self.get_cardinality(header))

        for i in range(num_rows):
            state = {}
            row_display = []

            for j in range(n):
                is_true = bool((i >> ( n - 1 - j)) & 1)
                var_name = variables[j]

                state[var_name] = is_true
                row_display.append("T" if is_true else "F")

            try:
                result = eval(formula, {"__builtins__": None}, state)
                result_display = "T" if result else "F"
            except Exception as e:
                result_display = "Error"

            print(" | ".join(row_display) + f" | { result_display}")
    
    def characteristic_function(self, x, A):
        return 1 if self.manual_contains(x, A) else 0

    def absolute_complement(self, A, U):
        return self.relative_complement(U, A)

    def union(self, A, B):
        result = []
        for x in A:
                result.append(x)

        for x in B:
            if not self.manual_contains(x, result):
                result.append(x)
        return result
    
    def intersection(self, A, B):
        result = []
        for x in A:
            if (self.manual_contains(x, B)):
                result.append(x)
        return result

    def relative_complement(self, A, B):
        result = []
        for x in A:
            if not self.manual_contains(x, B):
                result.append(x)
        return result
    
    def inclusion_exclusion(self, A, B):
        size_A = self.get_cardinality(A)
        size_B = self.get_cardinality(B)

        overlap = self.intersection(A,B)
        size_overlap = self.get_cardinality(overlap)

        return (size_A + size_B) - size_overlap
    
    def inclusion_exclusion_three(self, A, B, C):

        size_A = self.get_cardinality(A)
        size_B = self.get_cardinality(B)
        size_C = self.get_cardinality(C)

        size_AB = self.get_cardinality(self.intersection(A, B))
        size_AC = self.get_cardinality(self.intersection(A, C))
        size_BC = self.get_cardinality(self.intersection(B, C))

        triple_inter = self.intersection(A, self.intersection(B,C))
        size_ABC = self.get_cardinality(triple_inter)

        return (size_A + size_B + size_C) - ( size_AB + size_AC + size_BC) + size_ABC

    def cartesian_product(self, A, B):
        result = []
        for a in A:
            for b in B:
                result.append((a,b))
        return result
    
    def power_set(self, A):
        subsets = [[]]

        for element in A:
            num_subsets = []
            for current_subset in subsets:
                num_subsets.append(current_subset + [element])
            for s in num_subsets:
                subsets.append(s)

        return subsets


def parse_input(data_string):
    items = [item.strip() for item in data_string.split(",")]
    refined = []
    for x in items:
        try:
            refined.append(int(x))
        except ValueError:
            refined.append(x)
    return refined

if __name__ == "__main__":
    df = DiscreteFramework()

    workspace = {
        "A": [],
        "B": [],
        "C": [],
        "U": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    while True:
        print("\n" + "="*40)
        print(f"Current U -> {workspace['U']}")
        print(f" Current Sets -> A: {workspace['A']} | B: {workspace['B']} | C: {workspace['C']}")
        print("="*40)
        print("1. Update Set (A, B, C, or U)")
        print("2. Set Operations (Union, Intersect, Comp)")
        print("3. Inclusion-Exclusion (Auto-detect 2 or 3)")
        print("4. Logic Truth Table Generator")
        print("0. Exit")
        
        choice = input("\nSelect an option: ")

        match choice:
            case "1":
                target = input("Which set? (A/B/C/U): ").upper()
                if target in workspace:
                    data = input(f"Enter {target} (comma separated): ")
                    workspace[target] = parse_input(data)
                else:
                    print("Invalid set name.")

            case "2":
                A, B, U = workspace["A"], workspace["B"], workspace["U"]
                print(f"\nUnion (A \u222a B): {df.union(A, B)}")
                print(f"Intersection (A \u2229 B): {df.intersection(A, B)}")
                if U:
                    print(f"Absolute Complement (A'): {df.absolute_complement(A, U)}")

            case "3":
                if len(workspace["C"]) == 0:
                    print("\n[Detected: 2 Sets Only]")
                    result = df.inclusion_exclusion(workspace["A"], workspace["B"])
                else:
                    print("\n[Detected: 3 Sets]")
                    result = df.inclusion_exclusion_three(workspace["A"], workspace["B"], workspace["C"])
                
                print(f"Cardinality of Union: {result}")

            case "4":
                print("\n" + "-"*30)
                print("   LOGIC SYNTAX LEGEND")
                print("-"*30)
                print(" • Conjunction:  'and'")
                print(" • Disjunction:  'or'")
                print(" • Negation:     'not'")
                print(" • Exclusive OR: '^'")
                print(" • Equivalence:  '=='")
                print("-"*30)
                
                formula = input("Enter formula (e.g., 'not (A and B)'): ")
                
                vars_raw = input("Enter variables (e.g., 'A, B'): ")
                vars_in = [v.strip() for v in vars_raw.split(",") if v.strip()]
                
                if vars_in:
                    print("\nGenerating Truth Table...")
                    df.generate_truth_table(formula, vars_in)
                else:
                    print("Error: You must provide at least one variable.")

            case "0":
                print("Exiting...")
                break
                
            case _:
                print("Invalid selection.")

    # U = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    # set_A = df.create_set([1, 2, 3, 4])
    # set_B = [3, 4, 5, 6]
    # set_C = [5, 6, 7, 8]
    
    # print(f"Universal Set U: {U}")
    # print(f"Set A:           {set_A}")
    # print("-" * 30)

    # a_prime = df.absolute_complement(set_A, U)
    # print(f"Abs. Complement (A'): {a_prime}") 
    # # Expected: [0, 5, 6, 7, 8, 9, 10]

    # print(f"Is 3 in A? (Chi): {df.characteristic_function(3, set_A)}") # Expected: 1
    # print(f"Is 9 in A? (Chi): {df.characteristic_function(9, set_A)}") # Expected: 0

    # result = df.inclusion_exclusion(set_A, set_B)
    
    # print(f"Set A: {set_A} (Size: {df.get_cardinality(set_A)})")
    # print(f"Set B: {set_B} (Size: {df.get_cardinality(set_B)})")
    # print(f"Intersection: {df.intersection(set_A, set_B)}")
    # print("-" * 30)
    # print(f"Cardinality of Union (Principle): {result}")

    # S1 = [1, 2]
    # S2 = ['a', 'b']
    # cp = df.cartesian_product(S1, S2)
    # print(f"Cartesian Product: {cp}") 

    # S3 = [1, 2, 3]
    # ps = df.power_set(S3)
    # print(f"Power Set of {S3} (Size {df.get_cardinality(ps)}):")
    # for subset in ps:
    #     print(f"  {subset}")

    # result_3 = df.inclusion_exclusion_three(set_A, set_B, set_C)
    # print(f"\nCardinality of 3-Set Union (A u B u C): {result_3}")

    # m1 = [1, 1, 2, 3]
    # m2 = [1, 2, 2, 4]
    
    # print("--- MULTISET OPERATIONS ---")
    # print(f"M1: {m1}, M2: {m2}")
    # print(f"Multiset Union: {df.multiset_union(m1, m2)}")       # [1, 1, 2, 2, 3, 4]
    # print(f"Multiset Intersect: {df.multiset_intersection(m1, m2)}") # [1, 2]
    # print(f"Multiset Sum: {df.multiset_sum(m1, m2)}")            # [1, 1, 2, 3, 1, 2, 2, 4]
    
    # print("\n--- LOGIC EVALUATOR ---")
    # df.generate_truth_table("(A or B) and (not C)", ["A", "B", "C"])
