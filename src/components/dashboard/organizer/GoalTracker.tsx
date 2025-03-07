
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Target, Users, PiggyBank, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Goal {
  id: string;
  type: "attendees" | "funds" | "events";
  target: number;
  current: number;
  name: string;
  deadline?: string;
}

interface GoalTrackerProps {
  initialGoals?: Goal[];
}

const GoalTracker = ({ initialGoals = [] }: GoalTrackerProps) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals.length > 0 ? initialGoals : [
    {
      id: "1",
      type: "attendees",
      target: 500,
      current: 320,
      name: "Attendees target for Q2",
      deadline: "2023-06-30"
    },
    {
      id: "2",
      type: "funds",
      target: 10000,
      current: 6500,
      name: "Fundraising goal for education program",
      deadline: "2023-12-31"
    }
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedGoal, setEditedGoal] = useState<Goal | null>(null);

  const getIcon = (type: string) => {
    switch(type) {
      case "attendees": return <Users className="text-blue-500" />;
      case "funds": return <PiggyBank className="text-green-500" />;
      case "events": return <Target className="text-red-500" />;
      default: return <Target className="text-primary" />;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-[#8B5CF6]";
  };

  const handleEdit = (goal: Goal) => {
    setIsEditing(goal.id);
    setEditedGoal({...goal});
  };

  const handleSave = () => {
    if (!editedGoal) return;
    
    setGoals(goals.map(g => g.id === editedGoal.id ? editedGoal : g));
    setIsEditing(null);
    setEditedGoal(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditedGoal(null);
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Target className="mr-2 h-5 w-5 text-[#8B5CF6]" /> Goals & Targets
        </h3>
        <Button variant="outline" size="sm" className="text-xs">
          <Target className="mr-1 h-3.5 w-3.5" /> Add New Goal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="transition-all duration-300"
          >
            <Card className="overflow-hidden h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-start">
                  <span className="flex items-center">
                    {getIcon(goal.type)}
                    <span className="ml-2">{goal.name}</span>
                  </span>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0" 
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing === goal.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="goal-name">Goal Name</Label>
                      <Input 
                        id="goal-name"
                        value={editedGoal?.name || ""}
                        onChange={(e) => setEditedGoal({...editedGoal!, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="goal-type">Type</Label>
                        <Select 
                          value={editedGoal?.type}
                          onValueChange={(value) => setEditedGoal({...editedGoal!, type: value as any})}
                        >
                          <SelectTrigger id="goal-type" className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="attendees">Attendees</SelectItem>
                            <SelectItem value="funds">Fundraising</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="goal-target">Target</Label>
                        <Input 
                          id="goal-target"
                          type="number"
                          value={editedGoal?.target || 0}
                          onChange={(e) => setEditedGoal({...editedGoal!, target: parseInt(e.target.value)})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="goal-current">Current Value</Label>
                      <Input 
                        id="goal-current"
                        type="number"
                        value={editedGoal?.current || 0}
                        onChange={(e) => setEditedGoal({...editedGoal!, current: parseInt(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-deadline">Deadline</Label>
                      <Input 
                        id="goal-deadline"
                        type="date"
                        value={editedGoal?.deadline || ""}
                        onChange={(e) => setEditedGoal({...editedGoal!, deadline: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 mb-1">
                      <div className="flex justify-between items-center text-sm mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {goal.current} / {goal.target}
                          {goal.type === "funds" && " £"}
                        </span>
                      </div>
                      <div className="h-2 relative overflow-hidden rounded-full">
                        <div className="h-full w-full bg-secondary absolute"></div>
                        <motion.div 
                          className={`h-full absolute ${getProgressColor(Math.min(100, (goal.current / goal.target) * 100))}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        {goal.current >= goal.target ? (
                          <span className="flex items-center text-green-500">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Goal achieved!
                          </span>
                        ) : (
                          <span>
                            {((goal.target - goal.current) / goal.target * 100).toFixed(0)}% to go
                          </span>
                        )}
                      </span>
                      {goal.deadline && (
                        <span className="text-muted-foreground">
                          Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
              {isEditing === goal.id && (
                <CardFooter className="flex justify-end space-x-2 pt-0">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                  <Button variant="default" size="sm" onClick={handleSave}>Save</Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GoalTracker;
