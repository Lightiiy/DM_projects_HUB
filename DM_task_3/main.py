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




if __name__ == "__main__":
    df = DiscreteFramework()
    U = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    set_A = df.create_set([1, 2, 3, 4])
    set_B = [3, 4, 5, 6]
    set_C = [5, 6, 7, 8]
    
    print(f"Universal Set U: {U}")
    print(f"Set A:           {set_A}")
    print("-" * 30)

    # Test Absolute Complement
    a_prime = df.absolute_complement(set_A, U)
    print(f"Abs. Complement (A'): {a_prime}") 
    # Expected: [0, 5, 6, 7, 8, 9, 10]

    # Test Characteristic Function
    print(f"Is 3 in A? (Chi): {df.characteristic_function(3, set_A)}") # Expected: 1
    print(f"Is 9 in A? (Chi): {df.characteristic_function(9, set_A)}") # Expected: 0

    result = df.inclusion_exclusion(set_A, set_B)
    
    print(f"Set A: {set_A} (Size: {df.get_cardinality(set_A)})")
    print(f"Set B: {set_B} (Size: {df.get_cardinality(set_B)})")
    print(f"Intersection: {df.intersection(set_A, set_B)}")
    print("-" * 30)
    print(f"Cardinality of Union (Principle): {result}")

    S1 = [1, 2]
    S2 = ['a', 'b']
    cp = df.cartesian_product(S1, S2)
    print(f"Cartesian Product: {cp}") 

    S3 = [1, 2, 3]
    ps = df.power_set(S3)
    print(f"Power Set of {S3} (Size {df.get_cardinality(ps)}):")
    for subset in ps:
        print(f"  {subset}")

    result_3 = df.inclusion_exclusion_three(set_A, set_B, set_C)
    print(f"\nCardinality of 3-Set Union (A∪B∪C): {result_3}")
