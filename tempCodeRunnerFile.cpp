#include<bits/stdc++.h>
using namespace std;

int main(){
  
    vector<vector<char>> v = {{'1', 'A','@', '3', 'Q', 'B', '7'},
    {'Z', '1', 'G' ,'3', 'A', '@'}};
    int n = v.size();    
      unordered_map<char,int>mp;
      
      for (int i=0;i<n;i++)
      {
        for(int j=0;j<v[i].size();j++)
        {
              mp[v[i][j]]++;
        }
      }

      vector<char>ans;

      for(auto &i : mp){
        if(i.second == n){
            ans.push_back(i.first);
        }
      }

      for(int i=0;i<ans.size();i++)
      {
        cout<<ans[i]<<" ";
      }

}