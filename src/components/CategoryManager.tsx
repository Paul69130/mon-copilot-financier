
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Category } from '@/types/financial';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CategoryManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  onAddCategory: (category: Omit<Category, 'id'>) => string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onUpdateCategories,
  onAddCategory
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3b82f6',
    type: 'expense' as 'income' | 'expense'
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
  ];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    onAddCategory(newCategory);
    setNewCategory({
      name: '',
      color: '#3b82f6',
      type: 'expense'
    });

    toast({
      title: "Category Added",
      description: `Category "${newCategory.name}" has been created.`,
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    );
    
    onUpdateCategories(updatedCategories);
    setEditingId(null);
    setEditingCategory(null);

    toast({
      title: "Category Updated",
      description: `Category "${editingCategory.name}" has been updated.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);

    toast({
      title: "Category Deleted",
      description: `Category "${category?.name}" has been deleted.`,
    });
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
          </CardTitle>
          <CardDescription>Create a new category for organizing transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="category-type">Type</Label>
              <Select
                value={newCategory.type}
                onValueChange={(value: 'income' | 'expense') => 
                  setNewCategory(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    newCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Income Categories</CardTitle>
          <CardDescription>Categories for income transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No income categories yet.</p>
            ) : (
              incomeCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: editingCategory?.color }}
                      />
                      <Input
                        value={editingCategory?.name || ''}
                        onChange={(e) => setEditingCategory(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        {predefinedColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setEditingCategory(prev => 
                              prev ? { ...prev, color } : null
                            )}
                            className={`w-6 h-6 rounded border ${
                              editingCategory?.color === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">Income</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Expense Categories</CardTitle>
          <CardDescription>Categories for expense transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expense categories yet.</p>
            ) : (
              expenseCategories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === category.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: editingCategory?.color }}
                      />
                      <Input
                        value={editingCategory?.name || ''}
                        onChange={(e) => setEditingCategory(prev => 
                          prev ? { ...prev, name: e.target.value } : null
                        )}
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        {predefinedColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setEditingCategory(prev => 
                              prev ? { ...prev, color } : null
                            )}
                            className={`w-6 h-6 rounded border ${
                              editingCategory?.color === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">Expense</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
